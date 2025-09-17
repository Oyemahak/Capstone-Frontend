import Container from "../../components/layout/Container.jsx";
import Card, { CardHeader, CardContent, CardTitle } from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

export default function Login() {
  return (
    <main className="section">
      <Container>
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader><CardTitle>Login</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Email" type="email" />
              <Input placeholder="Password" type="password" />
              <Button className="w-full">Login</Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}