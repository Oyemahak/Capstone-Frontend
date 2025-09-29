// src/pages/Pricing.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
    key: "react",
    stack: "React (Custom Coded)",
    price: 4000,
    description:
      "A fully custom-coded React website with fast performance and modern UX/UI.",
  },
  {
    key: "wordpress",
    stack: "WordPress",
    price: 2000,
    description:
      "A flexible WordPress site with themes, plugins, and CMS for easy content management.",
  },
  {
    key: "wix",
    stack: "Wix",
    price: 3000,
    description:
      "A beautifully designed Wix website with drag-and-drop editing and quick launch.",
  },
  {
    key: "email",
    stack: "Professional Email Setup",
    price: 400,
    description:
      "Business-grade email setup with your custom domain for a professional presence.",
  },
];

export default function Pricing() {
  const nav = useNavigate();
  const [selected, setSelected] = useState(plans[0].key);

  const active = useMemo(
    () => plans.find((p) => p.key === selected),
    [selected]
  );

  function goRegister() {
    // Redirect to contact with context (plan + label)
    const params = new URLSearchParams({
      plan: active.key,
      label: active.stack,
    }).toString();
    nav(`/contact?${params}`);
  }

  return (
    <Container className="section">
      <SectionTitle
        eyebrow="Our Packages"
        title="Choose Your Website Solution"
        align="center"
      />

      {/* Plan selector */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {plans.map((plan) => (
          <Button
            key={plan.key}
            onClick={() => setSelected(plan.key)}
            className={selected === plan.key ? "btn-primary" : "btn-outline"}
          >
            {plan.stack}
          </Button>
        ))}
      </div>

      {/* Selected plan card */}
      <div className="max-w-xl mx-auto">
        <Card className="card-surface text-center">
          <CardHeader>
            <CardTitle>{active.stack}</CardTitle>
            <p className="text-textSub mt-2">{active.description}</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <span className="line-through text-textSub text-lg">
                {CAD(active.price * 2)}
              </span>
              <span className="text-4xl font-bold text-primary">
                {CAD(active.price)}
              </span>
              <span className="text-green-500 font-semibold">
                50% OFF Limited Time
              </span>
            </div>

            <Button className="btn-primary mt-6" onClick={goRegister}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}