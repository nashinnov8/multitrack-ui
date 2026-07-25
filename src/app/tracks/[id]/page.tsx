import { TrackDetailView } from "@/features/tracks/components/TrackDetailView";

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <TrackDetailView trackId={id} />
    </div>
  );
}
