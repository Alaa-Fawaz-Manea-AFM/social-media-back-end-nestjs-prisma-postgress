import Link from "next/link";

const notFound = () => (
  <div className="flex flex-col items-center justify-center gap-5 pt-36">
    <div className="text-3xl">Sorry, not found page,</div>
    <Link href="/" className="text-xl cursor-pointer" type="button">
      <b>Go to Home Page</b>
    </Link>
  </div>
);

export default notFound;
