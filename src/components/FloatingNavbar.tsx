"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import Image from "next/image";

export default function FloatingNavbar() {
  return (
    <Navbar className="shadow-md" shouldHideOnScroll>
      <NavbarBrand className="flex items-center gap-2">
        <Image
          className="dark:invert w-[51px] h-[45px]"
          src="/logo.svg"
          alt="Next.js logo"
          width={200}
          height={200}
          priority
        />
        <span className="sr-only">Rekkoku</span>
        <div>
          <h1 className="font-bold">Rekkoku</h1>
          <p className="text-xs">Share your taste!</p>
        </div>
      </NavbarBrand>
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            className="bg-[#EA7B26] hover:bg-[#EA7B26]/80 hover:text-white text-white font-semibold"
            href="/login"
            variant="flat"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
