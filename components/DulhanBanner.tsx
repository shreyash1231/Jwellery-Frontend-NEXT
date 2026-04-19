export default function DulhanBanner() {
  return (
    <section className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:justify-between px-10 md:px-20 py-16 gap-10">

      {/* LEFT: Text */}
      <div className="flex flex-col gap-5 max-w-sm">
        <h2 className="text-4xl md:text-5xl font-light tracking-widest text-gray-900 uppercase">
          Dulhan
        </h2>

        <p className="text-gray-600 leading-relaxed text-xl">
          KUCH ALAG brides don’t need the spotlight, they carry it. Our pieces just keep up.
        </p>

        {/* <button className="mt-2 w-fit px-8 py-3 bg-[#2d5a27] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#1e3d1a] transition-colors">
          Explore
        </button> */}
      </div>

      {/* RIGHT: Image */}
      <div className="w-full md:w-[58%] lg:w-[55%]">
        <img
          src="/Images/0f0b3050-43f2-400e-aea9-ab97b6e49093.jpg"
          alt="Dulhan bridal jewellery"
          className="w-full h-[500px] object-cover rounded-2xl"
        />
      </div>

    </section>
  );
}