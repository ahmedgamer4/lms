"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SubdomainPage() {
  const searchParams = useSearchParams();
  const querySubdomain = searchParams?.get("subdomain") || "";
  const [subdomain] = useState(querySubdomain);

  const handleGo = () => {
    const { protocol, hostname, port } = window.location;
    const isLocal = hostname.includes("localhost");
    const rootDomain = isLocal ? "localhost" : hostname;
    const portSegment = port ? ":" + port : "";
    const target = `${protocol}//${subdomain}.${rootDomain}${portSegment}`;
    window.location.href = target;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-2 text-3xl font-semibold">{subdomain}</h1>
      <p className="text-lg text-gray-700">
        {subdomain ? `${subdomain}.example.com` : "No subdomain provided"}
      </p>
      <Button onClick={handleGo} className="mt-6" disabled={!subdomain}>
        Go to my platform
      </Button>
    </div>
  );
}
