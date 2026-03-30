import { redirect } from "next/navigation";

export default function Page() {
  redirect("/home");
  //redirect("/login") dung khi localhost mac dinh la login.
}