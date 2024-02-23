import React from "react";

const Cons = () => {
  const cons = [
    { id: 1, title: "Timely Sample Collection, Hassle-Free Experience" },
    { id: 2, title: "Delivering Trust: Assured Quality, Every Time" },
    {
      id: 3,
      title: "Easy as Click, Book, Done: Hassle-Free Appointments Await",
    },
    { id: 4, title: "Accessible Care at Reasonable Prices" },
  ];

  return (
    <div className="w-full h-auto px-8 py-10 bg-slate-100">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cons.map((con) => (
          <div key={con.id}>
            <p className="text-sm font-medium tracking-wider text-center">
              {con.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cons;
