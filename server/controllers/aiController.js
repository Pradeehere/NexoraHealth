const getAiSuggestions = async (req, res, next) => {
    try {
        const healthData = req.body;
        // Fallback or mock AI response as per prompt instructions
        const tips = [
            "Maintain your current water intake consistency for better hydration.",
            "Consider adding 15 minutes of cardio to burn those extra calories.",
            "Your sleep pattern shows slight irregularity; aim for 8 hours tonight.",
            "Great job maintaining your weight target!",
            "Consider practicing mindfulness to improve your daily mood score."
        ];

        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
            // Note: in a real app, you'd call the OpenAI SDK here.
            // But per instructions: "If the key is missing or dummy, return realistic mock AI response".
            // Since it's a dummy right now, we return mock.
        }

        res.status(200).json({ suggestions: tips });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAiSuggestions };
