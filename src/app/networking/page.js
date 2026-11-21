import NetworkingTracker from "@/components/networking/NetworkingTracker";

export const metadata = {
  title: "Networking",
};

export default function NetworkingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Networking Tracker
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        Keep track of the professional contacts you meet and the follow-ups
        that keep those relationships strong. Add a record for each new
        connection, update its status as you follow up, and remove entries you
        no longer need. Records are stored on the server in a JSON file
        through the REST API.
      </p>

      <NetworkingTracker />
    </div>
  );
}
