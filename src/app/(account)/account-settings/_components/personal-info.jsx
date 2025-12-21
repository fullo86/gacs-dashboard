import {
  CallIcon,
  EmailIcon,
  PasswordIcon,
  UserIcon,
} from "@/assets/icons";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";

export function PersonalInfoForm(props) {
  return (
    <ShowcaseSection title="Personal Information" className="!p-7">
      <form onSubmit={props.onSubmit}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="first_name"
            label="First Name"
            placeholder={props.data.first_name}
            value={props.data.first_name}
            onChange={props.onChange}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="last_name"
            label="Last Name"
            placeholder={props.data.last_name}
            value={props.data.last_name}
            onChange={props.onChange}
            icon={<UserIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="email"
            label="Email Name"
            placeholder={props.data.email}
            value={props.data.email}
            onChange={props.onChange}
            icon={<EmailIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            className="w-full sm:w-1/2"
            type="text"
            name="phone"
            label="Phone Number"
            placeholder={props.data.phone}
            value={props.data.phone}
            onChange={props.onChange}
            icon={<CallIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <InputGroup
          className="mb-5.5"
          type="password"
          name="password"
          label="Password"
          placeholder="Type your password to confirm"
          value={props.data.password || ""}
          onChange={props.onChange}
          icon={<PasswordIcon />}
          iconPosition="left"
          height="sm"
        />        

        <div className="flex justify-end gap-3">
          <Link href={'/dashboard'} className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white">
            Cancel
          </Link>

          <button
            className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </ShowcaseSection>
  );
}
