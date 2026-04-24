from duckduckgo_search import DDGS

class BaseAgent:
    def __init__(self, client, model):
        self.client = client
        self.model = model

    def call_llm(self, system, user):
        return self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user}
            ],
            model=self.model,
            temperature=0.5
        ).choices[0].message.content


class ResearchAgent(BaseAgent):
    def get_keywords(self, topic):
        res = self.call_llm("Generate 5 search queries.", topic)
        return [k.strip() for k in res.split("\n") if k.strip()]

    def search(self, keywords):
        data = []
        with DDGS() as ddgs:
            for k in keywords[:3]:
                results = ddgs.text(k, max_results=3)
                for r in results:
                    data.append(r["body"])
        return "\n".join(data)

    def summarize(self, raw):
        return self.call_llm("Summarize into key facts.", raw)


class WriterAgent(BaseAgent):
    def write(self, topic, context):
        return self.call_llm(
            "Write a structured essay.",
            f"{topic}\n\n{context}"
        )


class CriticAgent(BaseAgent):
    def critique(self, draft):
        return self.call_llm("Critique harshly.", draft)


class EvaluatorAgent(BaseAgent):
    def score(self, essay):
        return self.call_llm(
            "Give score out of 10 for clarity, depth, structure.",
            essay
        )


class EssaySystem:
    def __init__(self, client, model):
        self.research = ResearchAgent(client, model)
        self.writer = WriterAgent(client, model)
        self.critic = CriticAgent(client, model)
        self.evaluator = EvaluatorAgent(client, model)

    def run(self, topic):
        keywords = self.research.get_keywords(topic)
        raw = self.research.search(keywords)
        facts = self.research.summarize(raw)

        draft = self.writer.write(topic, facts)

        history = []

        for _ in range(3):
            critique = self.critic.critique(draft)

            history.append({
                "draft": draft,
                "critique": critique
            })

            draft = self.writer.call_llm(
    """You are an expert essay writer.

Rewrite the ORIGINAL essay by improving it based on the critique.

IMPORTANT:
- Do NOT analyze the critique
- Do NOT write about the critique
- ONLY return a refined version of the essay
- Keep it as a proper essay with introduction, body, and conclusion
""",
    f"ORIGINAL ESSAY:\n{draft}\n\nCRITIQUE:\n{critique}"
)

        score = self.evaluator.score(draft)

        return draft, score, history