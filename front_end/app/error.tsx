"use client";

const error = () => (
  <div className="flex flex-col items-center justify-center gap-5 pt-36">
    <h1 className="text-3xl">Sorry, Something An unepected event,</h1>
    <button
      onClick={() => window.location.reload()}
      className="text-xl cursor-pointer"
      type="button"
    >
      <b className="text-red-500">Reload Page</b>
    </button>
  </div>
);

export default error;
