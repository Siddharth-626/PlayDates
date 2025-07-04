import  AvailabilitySelector  from "@/components/availability/Recuring-availlability/AvailabilitySelector "
import Navbar from "@/components/Navbar";


 const Availability =()=>{
    return(
        <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
            <Navbar />
            <AvailabilitySelector />
        </div>
    )
}
export default Availability;