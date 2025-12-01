import { Checkbox } from "@/components/FormElements/checkbox";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";

export default function MikrotikConfig() {
  return (
    <ShowcaseSection title="MikroTik Configuration" className="!p-6.5">
      <form action="#">
        <InputGroup
          label="Host"
          type="text"
          name="host"
          placeholder="Enter your Host or IP Address"
          className="mb-4.5"
        />
        <InputGroup
          label="Port API"
          type="text"
          name="port"
          placeholder="Enter your Port"
          className="mb-4.5"
        />
        <InputGroup
          label="Username"
          type="text"
          name="username"
          placeholder="Enter Username"
          className="mb-4.5"
        />
        <InputGroup
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
        />

        <button className="flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 mt-5">
            Save Configuration
        </button>
      </form>
    </ShowcaseSection>
  );
}
