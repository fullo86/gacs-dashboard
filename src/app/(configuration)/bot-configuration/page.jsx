'use client'
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState } from "react";

export default function BotConfig() {
    const [form, setForm] = useState({
      bot_token: "",
      chat_id: "",
    });

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

  return (
    <ShowcaseSection title="BOT Configuration" className="!p-6.5">
      <form action="#">
        <InputGroup
          label="BOT Token"
          type="text"
          name="bot_token"
          value={form.bot_token}
          onChange={handleChange}
          placeholder="Enter your Token"
          className="mb-4.5"
        />
        <InputGroup
          label="CHAT ID"
          type="text"
          name="chat_id"
          value={form.chat_id}
          onChange={handleChange}
          placeholder="Enter your Chat ID"
          className="mb-4.5"
        />

        <button className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 mt-5">
            Save Configuration
        </button>
      </form>
    </ShowcaseSection>
  );
}
