import { Star, GraduationCap, Users } from "lucide-react";
import "./About.scss";

export default function AboutPage() {
  const journeyStats = [
    { number: "200+", text: "Happy Customers" },
    { number: "10k+", text: "Properties For Client" },
    { number: "16+", text: "Years Of Experience" },
  ];

  const values = [
    {
      icon: Star,
      title: "Trust",
      description:
        "Trust is the cornerstone of every successful real estate transaction.",
    },
    {
      icon: GraduationCap,
      title: "Excellence",
      description:
        "We set the bar high for ourselves. From the properties we list to the services we provide.",
    },
    {
      icon: Users,
      title: "Client-Centric",
      description:
        "Your dreams and needs are at the center of our universe. We listen, understand.",
    },
  ];

  const achievements = [
    {
      title: "3+ Years of Excellence",
      description:
        "With over 3 years in the industry, we've amassed a wealth of knowledge and experience, becoming a go-to resource for all things real estate.",
    },
    {
      title: "Happy Clients",
      description:
        "Our greatest achievement is the satisfaction of our clients. Their success stories fuel our passion for what we do.",
    },
    {
      title: "Industry Recognition",
      description:
        "We've earned the respect of our peers and industry leaders, with accolades and awards that reflect our commitment to excellence.",
    },
  ];

  return (
    <main className="about-page">
      <div className="container">
        <section className="journey">
          <h2>Our Journey</h2>
          <p>
            Our story is one of continuous growth and evolution. We started as a
            small team with big dreams, determined to create a real estate
            platform that transcended the ordinary. Over the years, we've
            expanded our reach, forged valuable partnerships, and gained the
            trust of countless clients.
          </p>
          <div className="stats">
            {journeyStats.map((item, index) => (
              <div key={index} className="stat-card">
                <h3>{item.number}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="values">
          <h2>Our Values</h2>
          <div className="value-cards">
            {values.map((item, index) => (
              <div key={index} className="value-card">
                <item.icon className="icon" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="achievements">
          <h2>Our Achievements</h2>
          <div className="achievement-cards">
            {achievements.map((item, index) => (
              <div key={index} className="achievement-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta">
          <h2>Start Your Real Estate Journey Today</h2>
          <p>
            Your dream property is just a click away. Whether you're looking for
            a new home, a strategic investment, or expert real estate advice,
            we're here to assist you every step of the way. Explore our
            available properties or get in touch with our team for personalized
            assistance.
          </p>
        </section>
      </div>
    </main>
  );
}
