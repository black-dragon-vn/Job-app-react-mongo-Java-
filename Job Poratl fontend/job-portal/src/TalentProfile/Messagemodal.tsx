/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Modal, Tabs, Textarea, Button, Avatar, Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconMessage, IconSend, IconMail, IconPhone,
  IconCheck, IconTemplate, IconEdit,
} from "@tabler/icons-react";
import { useState } from "react";
import { errNotification, sucessNotification } from "../Services/NotificationService";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface MessageModalProps {
  /** Recipient info */
  name: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string | number;
  picture?: string | any;
  skills?: string[];

  /** Trigger element – render prop so callers can pass any button/icon */
  trigger: (open: () => void) => React.ReactNode;

  /** Optional: called after message is "sent" (hook into real API here) */
  onSend?: (message: string) => Promise<void> | void;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const getAvatarUrl = (picture: any, fallback: string): string => {
  if (!picture) return fallback;
  if (typeof picture === "string") {
    return picture.startsWith("data:image")
      ? picture
      : `data:image/jpeg;base64,${picture}`;
  }
  if (typeof picture === "object") {
    try {
      const b64 = picture.buffer || picture.data || picture.toString?.("base64");
      return `data:image/jpeg;base64,${b64}`;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

/* ─────────────────────────────────────────────
   Template definitions
───────────────────────────────────────────── */
const buildTemplates = (name: string, jobTitle: string, skills: string[]) => [
  {
    id: "invite",
    icon: "📨",
    title: "Invite to Apply",
    description: "Invite candidate for an open position",
    body: `Hi ${name},\n\nI came across your profile and I'm really impressed with your background in ${skills[0] || "your field"}. We have an exciting ${jobTitle || "opportunity"} that I believe would be a great fit for your skills.\n\nWould you be open to learning more about it?\n\nLooking forward to connecting!\n\nBest regards`,
  },
  {
    id: "chat",
    icon: "💬",
    title: "Quick Chat",
    description: "Request a brief introduction call",
    body: `Hi ${name},\n\nI'd love to have a quick 15-minute chat about your experience with ${skills.slice(0, 2).join(" and ") || "your expertise"}.\n\nAre you available this week?\n\nBest regards`,
  },
  {
    id: "portfolio",
    icon: "🎨",
    title: "Request Work Samples",
    description: "Ask to see their portfolio",
    body: `Hi ${name},\n\nI'm very interested in your work. Could you share some examples of projects you've completed, especially related to ${skills[0] || "your field"}?\n\nThank you!\n\nBest regards`,
  },
  {
    id: "availability",
    icon: "📅",
    title: "Check Availability",
    description: "Ask if they're open to new roles",
    body: `Hi ${name},\n\nWe're currently hiring for a ${jobTitle || "position"} and your profile really stands out.\n\nCould you let me know your current availability and whether you're exploring new opportunities?\n\nBest regards`,
  },
  {
    id: "custom",
    icon: "✍️",
    title: "Custom Message",
    description: "Write from scratch",
    body: "",
  },
];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const MessageModal = ({
  name,
  jobTitle = "",
  company = "",
  email = "",
  phone,
  picture,
  skills = [],
  trigger,
  onSend,
}: MessageModalProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>("templates");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const templates = buildTemplates(name, jobTitle, skills);
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=06b6d4&color=fff&bold=true`;
  const avatarUrl = getAvatarUrl(picture, fallbackAvatar);

  /* ── Actions ── */
  const handleSelectTemplate = (body: string) => {
    setMessage(body);
    setActiveTab("compose");
  };

  const handleSend = async () => {
    if (!message.trim()) {
      errNotification("Error", "Please enter a message before sending.");
      return;
    }
    setSending(true);
    try {
      if (onSend) {
        await onSend(message);
      } else {
        // Simulated delay – replace with real API call
        await new Promise((r) => setTimeout(r, 700));
      }
      setSent(true);
      sucessNotification("Sent!", `Message delivered to ${name}.`);
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch {
      errNotification("Error", "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      setMessage("");
      setActiveTab("templates");
      setSent(false);
    }, 300);
  };

  /* ── Render ── */
  return (
    <>
      {trigger(open)}

      <Modal
        opened={opened}
        onClose={handleClose}
        centered
        size="lg"
        padding="xl"
        radius="xl"
        overlayProps={{ blur: 4, opacity: 0.5 }}
        title={
          /* ── Modal Header ── */
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar
                src={avatarUrl}
                alt={name}
                size={46}
                radius="xl"
                className="ring-2 ring-cyan-500/40"
              />
              {/* Online indicator dot */}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-mine-shaft-900" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-mine-shaft-100 leading-tight truncate">{name}</p>
              <p className="text-xs text-mine-shaft-400 truncate">
                {jobTitle}
                {company ? ` · ${company}` : ""}
              </p>
            </div>

            <Badge
              ml="auto"
              color="cyan"
              variant="light"
              size="sm"
              leftSection={<IconMessage size={11} />}
              className="flex-shrink-0"
            >
              Message
            </Badge>
          </div>
        }
        styles={{
          header: {
            backgroundColor: "var(--mantine-color-dark-8, #1a1b1e)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            paddingBottom: "1rem",
          },
          content: {
            backgroundColor: "var(--mantine-color-dark-8, #1a1b1e)",
          },
          body: {
            paddingTop: "1rem",
          },
          close: {
            color: "#94a3b8",
          },
        }}
      >
        {/* ── SUCCESS STATE ── */}
        {sent ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center animate-pulse">
              <IconCheck size={32} className="text-green-400" />
            </div>
            <p className="text-lg font-semibold text-mine-shaft-100">Message Sent!</p>
            <p className="text-sm text-mine-shaft-400">
              Your message to <span className="text-cyan-400 font-medium">{name}</span> has been delivered.
            </p>
          </div>
        ) : (
          <>
            {/* ── CONTACT INFO BAR ── */}
            {(email || phone) && (
              <div className="flex flex-wrap gap-3 mb-4 p-3 bg-mine-shaft-800/60 rounded-xl border border-mine-shaft-700/40">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 text-xs text-mine-shaft-300 hover:text-cyan-400 transition-colors"
                  >
                    <IconMail size={14} className="text-cyan-500/70" />
                    {email}
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-1.5 text-xs text-mine-shaft-300 hover:text-cyan-400 transition-colors"
                  >
                    <IconPhone size={14} className="text-cyan-500/70" />
                    {phone}
                  </a>
                )}
              </div>
            )}

            {/* ── TABS ── */}
            <Tabs
              value={activeTab}
              onChange={setActiveTab}
              color="cyan"
              variant="pills"
              radius="xl"
            >
              <Tabs.List mb="md" className="gap-2">
                <Tabs.Tab
                  value="templates"
                  leftSection={<IconTemplate size={14} />}
                  className="font-medium"
                >
                  Templates
                </Tabs.Tab>
                <Tabs.Tab
                  value="compose"
                  leftSection={<IconEdit size={14} />}
                  className="font-medium"
                >
                  Compose
                </Tabs.Tab>
              </Tabs.List>

              {/* ── TEMPLATES PANEL ── */}
              <Tabs.Panel value="templates">
                <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1
                  [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-mine-shaft-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t.body)}
                      className="group w-full text-left p-4
                        bg-mine-shaft-800/60 hover:bg-mine-shaft-700/80
                        border border-mine-shaft-700/50 hover:border-cyan-500/40
                        rounded-xl transition-all duration-200
                        hover:shadow-md hover:shadow-cyan-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl leading-none">{t.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-mine-shaft-100
                            group-hover:text-cyan-400 transition-colors leading-tight">
                            {t.title}
                          </p>
                          <p className="text-xs text-mine-shaft-500 mt-0.5">{t.description}</p>
                        </div>
                        <IconSend
                          size={15}
                          className="text-mine-shaft-600 group-hover:text-cyan-500
                            group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </Tabs.Panel>

              {/* ── COMPOSE PANEL ── */}
              <Tabs.Panel value="compose">
                <div className="flex flex-col gap-3">
                  <Textarea
                    placeholder={`Write your message to ${name}…`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    minRows={8}
                    maxRows={13}
                    autosize
                    styles={{
                      input: {
                        backgroundColor: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "#cbd5e1",
                        fontSize: "0.875rem",
                        lineHeight: 1.7,
                        resize: "none",
                        "&:focus": {
                          borderColor: "#06b6d4",
                        },
                      },
                    }}
                  />

                  {/* char count */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-mine-shaft-500">{message.length} characters</span>
                    {message.length >= 50 && (
                      <span className="text-green-400 flex items-center gap-1">
                        <IconCheck size={11} /> Good length
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant="light"
                      color="gray"
                      flex={1}
                      radius="xl"
                      onClick={() => {
                        setMessage("");
                        setActiveTab("templates");
                      }}
                      disabled={sending}
                    >
                      Clear
                    </Button>
                    <Button
                      flex={2}
                      radius="xl"
                      loading={sending}
                      disabled={!message.trim()}
                      rightSection={!sending && <IconSend size={15} />}
                      onClick={handleSend}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-500
                        hover:from-cyan-500 hover:to-cyan-400 border-none
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </>
        )}
      </Modal>
    </>
  );
};

export default MessageModal;