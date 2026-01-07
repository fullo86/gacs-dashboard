import { PasswordIcon } from "@/assets/icons"; // Gantilah dengan path ikon yang sesuai
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import Link from "next/link";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export function ChangePasswordForm(props) {
  const { old_password, new_password, confirm_password } = props.data || {};

  return (
    <ShowcaseSection title="Change Password" className="!p-7">
      <form onSubmit={props.onSubmit}>
        <div className="mb-5.5">
          <InputGroup
            className="w-full"
            type="password"
            name="old_password"
            label="Old Password"
            placeholder="Enter your old password"
            value={old_password || ""}  
            onChange={props.onChange}
            icon={<PasswordIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="mb-5.5">
          <InputGroup
            className="w-full"
            type="password"
            name="new_password"
            label="New Password"
            placeholder="Enter a new password"
            value={new_password || ""} 
            onChange={props.onChange}
            icon={<PasswordIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="mb-5.5">
          <InputGroup
            className="w-full"
            type="password"
            name="confirm_password"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirm_password || ""}
            onChange={props.onChange}
            icon={<PasswordIcon />}
            iconPosition="left"
            height="sm"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/settings"
            className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            Cancel
          </Link>

          <Button
            label="Save Changes"
            type="submit"
            variant="primary"
            shape="rounded"
            size="small"
            className="text-gray-2"
          />
        </div>
      </form>
    </ShowcaseSection>
  );
}
