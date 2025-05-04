import FusionForm from '../components/FusionForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">🧠 Brainrot Fusion</h1>
      <FusionForm />
    </main>
  );
}