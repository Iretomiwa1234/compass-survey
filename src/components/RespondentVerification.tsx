import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import {
  checkRespondentByHash,
  createRespondentByHash,
  type RespondentChannelResponse,
  type RespondentSession,
} from "@/lib/auth";

type RespondentVerificationProps = {
  hash: string;
  open: boolean;
  onVerified: (session: RespondentSession) => void;
  onPendingVerification: (session: RespondentSession, message: string) => void;
};

type VerificationStage = "email" | "signup";

const inputClass =
  "w-full rounded-xl sm:rounded-2xl bg-white px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-[#1A2330] placeholder:text-[#8C98AC] focus:outline-none focus:ring-2 focus:ring-[#206AB5]/25 transition shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md";

function readUserExists(response: RespondentChannelResponse): number {
  const fromDetails = Number(response?.data?.details?.user_exists ?? 0);
  if (Number.isFinite(fromDetails) && fromDetails > 0) return fromDetails;

  const fromData = Number(response?.data?.user_exists ?? 0);
  if (Number.isFinite(fromData) && fromData > 0) return fromData;

  return 0;
}

function responseMessage(response: RespondentChannelResponse): string {
  return (
    String(response?.message ?? "").trim() ||
    String(response?.data?.message ?? "").trim() ||
    ""
  );
}

function toSession(
  response: RespondentChannelResponse,
  fallbackHash: string,
  fallbackEmail: string,
): RespondentSession {
  const details = response?.data?.details;
  const hash = String(
    details?.hash ?? response?.data?.hash ?? fallbackHash,
  ).trim();
  const email = String(
    details?.email ?? response?.data?.email ?? fallbackEmail,
  ).trim();
  const fname = String(details?.fname ?? "").trim();
  const sname = String(details?.sname ?? "").trim();
  const phone = String(details?.phone ?? "").trim();
  const token = String(details?.token ?? "").trim();
  const user_exists = readUserExists(response);

  return {
    hash,
    email,
    fname,
    sname,
    phone,
    token: token || undefined,
    user_exists: user_exists || undefined,
    verification_pending: false,
  };
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizePhone(value: string): string {
  return value.replace(/[^\d+]/g, "").trim();
}

function isValidPhone(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 10;
}

export default function RespondentVerification({
  hash,
  open,
  onVerified,
  onPendingVerification,
}: RespondentVerificationProps) {
  const [stage, setStage] = useState<VerificationStage>("email");
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStage("email");
    setErrorMessage("");
  }, [open, hash]);

  const buttonLabel = useMemo(() => {
    if (isLoading) return "Please wait...";
    return stage === "email" ? "Continue" : "Continue";
  }, [isLoading, stage]);

  const handleUseDifferentEmail = () => {
    setStage("email");
    setFname("");
    setSname("");
    setPhone("");
    setErrorMessage("");
  };

  const handleCheckEmail = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await checkRespondentByHash({
        hash,
        email: normalizedEmail,
      });
      const userExists = readUserExists(response);

      if (response?.status === "success" && userExists === 1) {
        const session = toSession(response, hash, normalizedEmail);
        if (!session.token) {
          setErrorMessage(
            "Verification token was not returned. Please try again.",
          );
          return;
        }
        onVerified(session);
        return;
      }

      if (userExists === 2) {
        setStage("signup");
        return;
      }

      if (response?.status === "success" && userExists === 4) {
        const pendingSession: RespondentSession = {
          hash,
          email: normalizedEmail,
          user_exists: 4,
          verification_pending: true,
        };

        onPendingVerification(
          pendingSession,
          responseMessage(response) ||
            "A verification email has been sent. Open the link in your email to continue.",
        );
        return;
      }

      if (userExists === 3) {
        setErrorMessage(
          responseMessage(response) || "Only customers are allowed.",
        );
        return;
      }

      setErrorMessage(
        responseMessage(response) ||
          "We could not verify this email. Please try again.",
      );
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const safeFname = fname.trim();
    const safeSname = sname.trim();
    const safePhone = sanitizePhone(phone);

    if (!safeFname || !safeSname || !safePhone) {
      setErrorMessage("Please fill firstname, surname, and phone number.");
      return;
    }

    if (!isValidPhone(safePhone)) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await createRespondentByHash({
        hash,
        email: normalizedEmail,
        fname: safeFname,
        sname: safeSname,
        phone: safePhone,
      });

      const userExists = readUserExists(response);

      if (response?.status === "success" && userExists === 1) {
        const session = toSession(response, hash, normalizedEmail);
        if (!session.token) {
          setErrorMessage(
            "Verification token was not returned. Please try again.",
          );
          return;
        }
        onVerified(session);
        return;
      }

      if (response?.status === "success" && userExists === 4) {
        const pendingSession: RespondentSession = {
          hash,
          email: normalizedEmail,
          fname: safeFname,
          sname: safeSname,
          phone: safePhone,
          user_exists: 4,
          verification_pending: true,
        };

        onPendingVerification(
          pendingSession,
          responseMessage(response) ||
            "A verification email has been sent. Open the link in your email to continue.",
        );
        return;
      }

      if (
        response?.message?.toLowerCase().includes("phone") &&
        response?.message?.toLowerCase().includes("exist")
      ) {
        setErrorMessage(response.message);
        return;
      }

      setErrorMessage(
        responseMessage(response) ||
          "Could not create respondent profile. Please try again.",
      );
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stage === "email") {
      void handleCheckEmail();
      return;
    }

    void handleCreateAccount();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1726]/20 px-4 py-6 backdrop-blur-[1px]">
      <div className="w-full max-w-[760px] rounded-2xl bg-[#F4F6FA] p-6 sm:p-8 shadow-[0_24px_70px_rgba(22,30,41,0.2)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDE6F6] text-[#206AB5]">
          <Mail className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-center text-3xl font-semibold tracking-tight text-[#171E29] sm:text-4xl">
          Continue with email
        </h2>

        {stage === "signup" && (
          <p className="mx-auto mt-2 max-w-[560px] text-center text-sm text-[#5F6D82] sm:text-base">
            We couldn't find your account. Please complete your details so we
            can send a verification email.
          </p>
        )}

        <form
          className="mx-auto mt-8 max-w-[620px] space-y-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className={inputClass}
            disabled={isLoading || stage === "signup"}
          />

          {stage === "signup" && (
            <>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleUseDifferentEmail}
                className="-mt-1 text-left text-sm font-medium text-[#206AB5] transition hover:text-[#185997] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Wrong email? Use another one
              </button>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={fname}
                  onChange={(event) => setFname(event.target.value)}
                  placeholder="First name"
                  className={inputClass}
                  disabled={isLoading}
                />
                <input
                  type="text"
                  value={sname}
                  onChange={(event) => setSname(event.target.value)}
                  placeholder="Surname"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number"
                className={inputClass}
                disabled={isLoading}
              />
            </>
          )}

          {errorMessage && (
            <p className="rounded-xl bg-[#FEEBED] px-4 py-3 text-sm font-medium text-[#B1223C]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#206AB5] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#185997] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {buttonLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
