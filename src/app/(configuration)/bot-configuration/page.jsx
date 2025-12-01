import { Checkbox } from "@/components/FormElements/checkbox";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";

export default function BotConfig() {
  return (
    <ShowcaseSection title="BOT Configuration" className="!p-6.5">
      <form action="#">
        <InputGroup
          label="BOT Token"
          type="text"
          name="host"
          placeholder="Enter your Token"
          className="mb-4.5"
        />
        <InputGroup
          label="CHAT ID"
          type="text"
          name="port"
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
