import { Search, ArrowUpDown } from "lucide-react"

const bookings = [
  {
    name: "Camellia Swan",
    pkg: "Venice Dreams",
    dur: "6D5N",
    date: "Jun 25 - Jun 30",
    price: "$1,500",
    status: "Confirmed",
  },
  {
    name: "Raphael Goodman",
    pkg: "Safari Adventure",
    dur: "8D7N",
    date: "Jun 25 - Jul 2",
    price: "$3,200",
    status: "Pending",
  },
  {
    name: "Ludwig Contessa",
    pkg: "Alpine Escape",
    dur: "7D6N",
    date: "Jun 26 - Jul 2",
    price: "$2,100",
    status: "Confirmed",
  },
  {
    name: "Armina Raul Meyes",
    pkg: "Caribbean Cruise",
    dur: "10D9N",
    date: "Jun 25 - Jul 5",
    price: "$2,800",
    status: "Cancelled",
  },
  {
    name: "James Dunn",
    pkg: "Parisian Romance",
    dur: "5D4N",
    date: "Jun 28 - Jun 30",
    price: "$1,200",
    status: "Confirmed",
  },
]

const statusCls: Record<string, string> = {
  Confirmed: "bg-[#E3F7EC] text-[#22B357] border border-[#C9EFDA]",
  Pending: "bg-[#FFF8E5] text-[#E5A100] border border-[#FFE7A0]",
  Cancelled: "bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]",
}

export function RecentBookings() {
  return (
    <div className="rounded-[14px] border border-[#E4EAF1] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[#1A2B3D]">
          Recent Bookings
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[8px] border border-[#E4EAF1] px-2 py-[5px]">
            <Search className="h-[13px] w-[13px] text-[#8896A6]" />
            <input
              placeholder="Search anything"
              className="w-[100px] border-none bg-transparent text-[11px] placeholder-[#8896A6] outline-none"
            />
          </div>
          <button className="rounded-[8px] bg-[#2E7CF6] px-3 py-[5px] text-[11px] font-medium text-white transition hover:bg-[#1B5FCC]">
            View All
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E4EAF1]">
            {["Name", "Package", "Duration", "Date", "Price", "Status"].map(
              (h) => (
                <th
                  key={h}
                  className="px-2.5 py-2 text-left text-[11px] font-medium text-[#8896A6]"
                >
                  <span className="flex items-center gap-1">
                    {h}
                    <ArrowUpDown className="h-[10px] w-[10px]" />
                  </span>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr
              key={i}
              className="border-b border-[#F0F4F8] transition last:border-0 hover:bg-[#F5F7FA]"
            >
              <td className="px-2.5 py-2.5 text-[11.5px] font-medium text-[#1A2B3D]">
                {b.name}
              </td>
              <td className="px-2.5 py-2.5 text-[11.5px] text-[#5A6E82]">
                {b.pkg}
              </td>
              <td className="px-2.5 py-2.5 text-[11.5px] text-[#5A6E82]">
                {b.dur}
              </td>
              <td className="px-2.5 py-2.5 text-[11.5px] text-[#5A6E82]">
                {b.date}
              </td>
              <td className="px-2.5 py-2.5 text-[11.5px] font-semibold text-[#1A2B3D]">
                {b.price}
              </td>
              <td className="px-2.5 py-2.5">
                <span
                  className={`rounded-full px-2.5 py-[3px] text-[10px] font-semibold ${statusCls[b.status]}`}
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
