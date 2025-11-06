import { GiTennisBall  } from "react-icons/gi";

export const SkillBasedTennisBallsUi = ({skill}:{skill:string})=>{

    const numericalSkill = parseFloat(skill) || 0;

    const balls = Array.from({length:5},(_, i)=>(
            <GiTennisBall
            key={i}
            className={`lg:text-xl sm:text-sm ${i < numericalSkill ? "text-green-400" : "text-gray-400 dark:text-gray-600"
                }`}
        />
    ))
    return(
        <div>
            <div className="flex flex-wrap items-center gap-1">{balls}</div>
        </div>
    )
}