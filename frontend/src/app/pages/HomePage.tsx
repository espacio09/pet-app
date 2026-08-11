type HomePageProps = {
  onOpenPets: () => void;
};

export default function HomePage({
  onOpenPets,
}: HomePageProps) {
  return (
    <div>
      <h1>🐾 Bienvenido a PetCare</h1>

      <p>
        Gestiona tus mascotas de forma fácil y rápida.
      </p>

      <button onClick={onOpenPets}>
        Ver mis mascotas
      </button>
    </div>
  );
}
