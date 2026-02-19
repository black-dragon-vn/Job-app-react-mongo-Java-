import JobHistory from "../JobHistory/JobHistory";

const JobHistoryPage = () => {
    return(
      <div className="min-h-[100vh] bg-mine-shaft-950   font-poppins p-4">
            <div className="flex gap-10 justify-center">
              <JobHistory/>

            </div>
        </div>
    )
}

export default JobHistoryPage;