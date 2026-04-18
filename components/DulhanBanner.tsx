export default function DulhanBanner() {
  return (
    <section className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-16 gap-10">

      {/* LEFT: Text */}
      <div className="flex flex-col gap-5 max-w-sm">
        <h2 className="text-4xl md:text-4xl font-light tracking-widest text-gray-900 uppercase">
          Dulhan
        </h2>

        <p className="text-gray-600 leading-relaxed text-sm">
          Our beautiful bride adorned the heritage jewels from Preeti Mohan that
          defines her elegance and grace on her wedding day.
        </p>

        <p className="text-gray-600 leading-relaxed text-sm">
          Accentuate your wedding look wearing our enchanting bridal jewellery and
          accessories this summer season!
        </p>

        <button className="mt-2 w-fit px-8 py-3 bg-[#2d5a27] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#1e3d1a] transition-colors">
          Explore
        </button>
      </div>

      {/* RIGHT: Image */}
      <div className="w-full md:w-[58%] lg:w-[55%]">
        <img
          src="/Images/Index7.png"
          alt="Dulhan bridal jewellery"
          className="w-full h-[350px] object-cover object-top rounded-2xl"
        />
      </div>

    </section>
  );
}