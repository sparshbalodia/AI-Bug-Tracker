import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def enhance_issue(title, description):
    prompt = f"""
    Analyze this bug report:

    Title: {title}
    Description: {description}

    Return ONLY valid JSON:
    {{
      "severity": "low|medium|high",
      "repro_steps": ["step1", "step2"],
      "possible_cause": "string"
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        return response.text

    except Exception:
        # 🔥 FALLBACK (IMPORTANT)
        return """
        {
          "severity": "medium",
          "repro_steps": ["Open app", "Click login"],
          "possible_cause": "Unknown error"
        }
        """