import { MessagesManager } from "@/components/admin/MessagesManager";
import { listMessages } from "@/lib/data/repository";

export default async function MessagesPage() {
  const messages = await listMessages();
  return (
    <div>
      <h1 className="text-3xl font-semibold text-heading">Messages</h1>
      <p className="mt-2 mb-6 text-sm text-muted">Contact form submissions stay in this dashboard.</p>
      <MessagesManager messages={messages} />
    </div>
  );
}
