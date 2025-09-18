// src/pages/Pricing.jsx
import { useState } from "react";
import Container from "../components/layout/Container.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

// Format numbers as CAD
const CAD = (n) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }).format(n);

const plans = [
  {
    stack: "React (Custom Coded)",
    price: 4000,
    description:
      "A fully custom-coded React website with fast performance and modern UX/UI.",
  },
  {
    stack: "WordPress",
    price: 2000,
    description:
      "A flexible WordPress site with themes, plugins, and CMS for easy content management.",
  },
  {
    stack: "Wix",
    price: 3000,
    description:
      "A beautifully designed Wix website with drag-and-drop editing and quick launch.",
  },
  {
    stack: "Professional Email Setup",
    price: 400,
    description:
      "Business-grade email setup with your custom domain for a professional presence.",
  },
];

export default function Pricing() {
  const [selected, setSelected] = useState(plans[0].stack);

  return (
    <Container className="section">
      <SectionTitle
        eyebrow="Our Packages"
        title="Choose Your Website Solution"
        align="center"
      />

      {/* Stack Selector */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {plans.map((plan) => (
          <Button
            key={plan.stack}
            onClick={() => setSelected(plan.stack)}
            className={`${
              selected === plan.stack ? "btn-primary" : "btn-outline"
            }`}
          >
            {plan.stack}
          </Button>
        ))}
      </div>

      {/* Selected Plan */}
      <div className="max-w-xl mx-auto">
        {plans
          .filter((plan) => plan.stack === selected)
          .map((plan) => {
            const original = plan.price * 2; // double the base price
            return (
              <Card key={plan.stack} className="card-surface text-center">
                <CardHeader>
                  <CardTitle>{plan.stack}</CardTitle>
                  <p className="text-textSub mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-2">
                    <span className="line-through text-textSub text-lg">
                      {CAD(original)}
                    </span>
                    <span className="text-4xl font-bold text-primary">
                      {CAD(plan.price)}
                    </span>
                    <span className="text-green-500 font-semibold">
                      50% OFF Limited Time
                    </span>
                  </div>
                  <Button className="btn-primary mt-6">Get Started</Button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </Container>
  );
}