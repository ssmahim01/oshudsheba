/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Plus, Upload, X } from "lucide-react";
import Image from "next/image";

import { registerUser } from "@/utils/registerUser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UseFormRegisterReturn } from "react-hook-form";

const BANGLADESH_PHONE_REGEX = /^(?:\+8801|01)[3-9]\d{8}$/;

const MAX_PICTURE_SIZE = 2 * 1024 * 1024;

const ALLOWED_PICTURE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .trim()
      .regex(
        BANGLADESH_PHONE_REGEX,
        "Please enter a valid Bangladesh phone number",
      ),

    address: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address cannot exceed 500 characters"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password cannot exceed 128 characters."),

    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(128, "Password cannot exceed 128 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function PasswordField({
  id,
  placeholder,
  registration,
  error,
}: {
  id: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={id === "password" ? "new-password" : "new-password"}
        {...registration}
      />

      <button
        type="button"
        onClick={() => setShow((previous) => !previous)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface RegisterModalProps {
  refetch: () => void | Promise<void>;
}

export default function RegisterModal({ refetch }: RegisterModalProps) {
  const [open, setOpen] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema as any),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",

      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    return () => {
      if (picturePreview) {
        URL.revokeObjectURL(picturePreview);
      }
    };
  }, [picturePreview]);

  const clearPicture = () => {
    setPictureFile(null);
    setPicturePreview(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !ALLOWED_PICTURE_TYPES.includes(
        file.type as (typeof ALLOWED_PICTURE_TYPES)[number],
      )
    ) {
      toast.error("Only PNG, JPG, and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PICTURE_SIZE) {
      toast.error("Image must be under 2MB.");
      event.target.value = "";
      return;
    }

    if (picturePreview) {
      URL.revokeObjectURL(picturePreview);
    }

    setPictureFile(file);
    setPicturePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    if (isLoading) return;

    reset();
    clearPicture();
    setOpen(false);
  };

  const onSubmit = async (data: SignupFormValues) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("email", data.email.trim().toLowerCase());
      formData.append("phone", data.phone.trim());
      formData.append("address", data.address.trim());
      formData.append("password", data.password);

      if (pictureFile) {
        formData.append("picture", pictureFile);
      }

      const response = await registerUser(formData);

      if (!response.success) {
        toast.error(response.message || "Registration failed.");
        return;
      }

      toast.success(response.message || "Account created successfully!");

      reset();
      clearPicture();
      setOpen(false);

      await refetch();
    } catch (error) {
      console.error("Register form error:", error);

      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
        else setOpen(true);
      }}
    >
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button className={"cursor-pointer"}>
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-sm sm:max-w-[500] max-h-[90vh]  overflow-y-auto p-6">
        <div className="absolute left-0 right-0 top-0 h-0.5" />
        <DialogHeader className="flex flex-col items-center gap-2 pb-2 text-center">
          <DialogTitle className=" uppercase">Create Account</DialogTitle>
          <DialogDescription className="text-[#96999A] text-sm tracking-wide">
            Join Oshud Sheba today
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...registerField("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...registerField("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              {...registerField("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <Label
              htmlFor="address"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Address
            </Label>
            <Textarea
              id="address"
              placeholder="House no., Road, Area, City"
              rows={3}
              {...registerField("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-400">{errors.address.message}</p>
            )}
          </div>

          {/* Picture Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold tracking-widest uppercase">
              Profile Picture{" "}
              <span className="text-[#96999A] normal-case font-normal">
                (optional)
              </span>
            </Label>
            {picturePreview ? (
              <div className="relative  flex items-center gap-3 rounded-md border p-2">
                <Image
                  width={200}
                  height={200}
                  priority
                  quality={90}
                  src={picturePreview}
                  alt="Preview"
                  className="h-14 w-14 rounded-md object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#96999A]">
                    {pictureFile
                      ? (pictureFile.size / 1024).toFixed(1) + " KB"
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearPicture}
                  className="shrink-0 rounded-full p-1 text-[#96999A] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="picture-upload"
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#4a5568] px-4 py-6 cursor-pointer
                                hover:bg-gray-200 transition-colors group"
              >
                <Upload className="h-6 w-6 text-black" />
                <div className="text-center">
                  <p className="text-sm">Click to upload photo</p>
                  <p className="text-xs text-[#96999A]/70">
                    PNG, JPG, WEBP — max 2MB
                  </p>
                </div>
                <input
                  id="picture-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Password
            </Label>
            <PasswordField
              id="password"
              placeholder="Create a password"
              registration={registerField("password")}
              error={errors.password?.message}
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold tracking-widest uppercase"
            >
              Confirm Password
            </Label>
            <PasswordField
              id="confirmPassword"
              placeholder="Re-enter your password"
              registration={registerField("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 font-bold tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1e0f] border-t-transparent" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
