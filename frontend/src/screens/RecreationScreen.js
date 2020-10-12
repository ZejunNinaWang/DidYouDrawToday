import React from 'react';

function RecreationScreen(props){
    const dispatch = useDispatch();
    // const recreationsById = useSelector(state => state.recreationsById);
    const recreation = useSelector(state => state.recreationsById[props.match.params.id]);
    useEffect(()=> {
        if(!recreation){
            dispatch(queryRecreation(props.match.params.id));
        }
    }, [recreation])


    return(
        <>
            <div className="content-margined">
                

            </div>
        </>
    )
}

export default RecreationScreen;