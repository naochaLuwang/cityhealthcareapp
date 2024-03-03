import { Command, Instagram } from "lucide-react";
const Footer = () => {
  return (
    <div className="relative w-full shadow-md bg-slate-100 h-96">
      <div className="grid grid-cols-3 px-8 py-10">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <Command className="w-10 h-10 text-blue-700" />
            <h1 className="text-xl font-semibold tracking-widest text-slate-700">
              CITY HEALTH CARE
            </h1>
          </div>
        </div>
        <div></div>
        <div className="flex flex-col items-end justify-end w-full h-64 space-y-5">
          <div className="flex items-center space-x-2">
            <Instagram className="w-6 h-6" />
            <p>city_healthcare</p>
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-6 h-6" />
            <p>city_healthcare</p>
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-6 h-6" />
            <p>city_healthcare</p>
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-6 h-6" />
            <p>city_healthcare</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-10 px-8 bg-blue-800">
        <div className="flex items-center w-full h-10">
          <p className="text-xs text-white">
            Copyright &copy; 2024. City Health Care. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
