export default function TaskOverview() {
    return (
     <>   
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        Task Overview
      </h1>
     


      <p className="mt-4 max-w-xl text-2xl text-gray-400">
        Notes and pointers on how I addressed this challenge
      </p>

       <p className="mt-4 max-w-2xl text-lg text-gray-600">
        Tech Stack : React, Vite, Tailwind css, React Router
      </p>

       <p className="mt-4 max-w-2xl text-lg text-gray-600">
         ✅ Receive correct input methods 
      </p>

       <p className="mt-4 max-w-2xl text-lg text-gray-600">
         ✅ Working Calculator functionality 
      </p>

       <p className="mt-4 max-w-2xl text-lg text-gray-600">
         ✅ Mobile Friendly and Deployed
      </p>


    </div>
    <div className="items-center justify-center  px-4 py-16 text-center sm:py-24">
        <p className="text-2xl">
        Limitations : 
        </p>
       
        <p >
        - Some assumptions are too ideal and dont show realtime data and information.
        </p>

        <p >
        - Since frontend styling is not being assessed I would Spent more time on it.
        </p>

         <p >
        - If more complex functionality and routing was required in I would have used a more complex tech stack.
        </p>
    </div>
   

    
    </>
  );
}

