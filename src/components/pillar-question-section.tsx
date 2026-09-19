type FrameworkQuestion = {
  question: string;
  explanation: string;
  also?: string;
};

type PillarQuestionSectionProps = {
  number: string;
  pillar: string;
  description: string;
  questions: FrameworkQuestion[];
  note?: string;
};

export function PillarQuestionSection({
  number,
  pillar,
  description,
  questions,
  note,
}: PillarQuestionSectionProps) {
  return (
    <section className="framework-pillar" id={pillar.toLowerCase()}>
      <div className="framework-pillar-heading">
        <span>{number}</span>
        <div>
          <p className="eyebrow">Bridge section {number} of 03</p>
          <h2>{pillar}</h2>
          <p>{description}</p>
          {note && <p className="pillar-note">{note}</p>}
        </div>
      </div>
      <div className="question-card-grid">
        {questions.map((item, index) => (
          <article className="question-card" key={item.question}>
            <span className="question-index">{number}.{index + 1}</span>
            <h3>{item.question}</h3>
            <p>{item.explanation}</p>
            {item.also && <p className="also-affects">Also affects: {item.also}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
