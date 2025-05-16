import { ReactNode } from "react";

export default function CourseLessonLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
