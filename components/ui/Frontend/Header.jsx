import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { PenBox } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./UserMenu";
import { CheckUser } from "@/lib/checkUser";
import UserLoading from "./UserLoading";

const Header = async () => {
  await CheckUser();
  return (
    <header className="container mx-auto">
      <nav className="py-6 px-4 flex justify-between items-center gap-2">
        <Link href={"/"}>
          <Image
            src={"/logo2.png"}
            alt="Flowgrid-logo"
            width={200}
            height={56}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href={"/project/create"}>
              <Button variant="destructive" className="flex items-center gap-2">
                <PenBox size={18} />
                <span>Create Project</span>
              </Button>
            </Link>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
      <UserLoading />
    </header>
  );
};

export default Header;
