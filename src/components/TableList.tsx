
export interface CareerType{
    title: string
    department: string
    location: string
}

export function TableList({career} : {career : CareerType}) {
    return(
        <div id='table-grid'>
            <div className='table-detail'>{career.title}</div>
            <div className='table-detail'>{career.department}</div>
            <div className='table-detail'
                style={career.location == 'Jakarta' ? { fontWeight: '800'} : {}}>
                {career.location}
            </div>
        </div>
    )
}