// export async function GET(request: Request) {
// 	const { searchParams } = new URL(request.url)
// 	const id = searchParams.get('id')

// 	// fetch from db or api
// 	// if db return data
// 	// if api return data = await res.json
// 	// return will be Response.json if ts vs >= 5.2
// 	// else just use NextResponse.json
// }

// // post using request body
// export async function POST(request: Request) {
//   const data: unknown = await request.json();

//   // validate data against zod schema

//   return Response.json(data)
// }

// // in client component
// // loading isLoading state
// // async function to handle fetch
// // try catch, set loading true, const res = await fetch api with headers for accept and method
// // if res const data = await res.json
// // catch will do something with error on frontend like toast
// // finally will set loading to false
// // this way if loading you can disable or show loading spinners on buttons etc...

// get seession
// if no session response.json({message: unauthorized}, {status: 401})
// if session get id from session.user
// get request body and validate it against zod schema
// try catch: (log error, return response.json({message: something went wrong}, {status: 500}))
// get user by id
// if no user response.json({message: user not found}, {status: 404})
// if user check role is admin
// create course with data and user id
// response.json({data: course}, {status: 201})
// handle loading/error/success in frontend for toasts and other
// ui updates.
