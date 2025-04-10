import userModel from "../Models/usermodel.js";
import axios from "axios";
import FormData from "form-data";

export const GenerateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    // Validate user and prompt
    if (!userId || !prompt) {
      return res
        .status(400)
        .json({ message: "User ID and prompt are required." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check credit balance
    if (user.CreditBalance === 0 || userModel.CreditBalance < 0) {
      return res.status(400).json({
        message: "Insufficient credit balance.",
        creditBalance: user.CreditBalance,
      });
    }

    // Check if API key is available
    if (!process.env.CLIPDROP_API) {
      return res.status(500).json({ message: "API key is missing." });
    }

    // Prepare the API request
    const formData = new FormData();
    formData.append("prompt", prompt);

    try {
      const { data } = await axios.post(
        "https://clipdrop-api.co/text-to-image/v1",
        formData,
        {
          headers: {
            "x-api-key": process.env.CLIPDROP_API,
          },
          responseType: "arraybuffer",
        }
      );

      // Convert the API response to Base64
      const base64Image = Buffer.from(data, "binary").toString("base64");
      const resultImage = `data:image/png;base64,${base64Image}`;

      // Deduct credit and update user
      user.CreditBalance -= 1;
      await user.save();

      res.json({
        success: true,
        message: "Image generated successfully.",
        creditBalance: user.CreditBalance,
        resultImage,
      });
    } catch (apiError) {
      console.error("API Error:", apiError.message);
      return res
        .status(502)
        .json({ message: "Error generating image from API." });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
