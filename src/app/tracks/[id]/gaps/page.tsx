import { GapsView } from "@/features/tracks/components/GapsView";

export default async function GapsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <GapsView trackId={id} />
    </div>
  );
}
