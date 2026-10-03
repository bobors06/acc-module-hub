import { useState } from 'react';

export default function Chatbox() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-20">
            <button
                onClick={() => setOpen(!open)}
                className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            >
                💬
            </button>

            {open && (
                <div className="absolute bottom-16 right-0 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                    <div className="bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">
                        Ask the admin
                        <div className="text-xs font-normal opacity-70">Requests, updates, or missing files</div>
                    </div>
                    <form className="flex gap-2 border-t border-border p-3">
                        <input
                            type="text"
                            placeholder="Type a message…"
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                        />
                        <button type="submit" className="w-9 rounded-lg bg-primary text-primary-foreground">
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}