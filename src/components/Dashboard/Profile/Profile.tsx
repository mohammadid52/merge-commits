import React, { useContext, useState, useEffect, Fragment } from 'react';
// import { API, graphqlOperation } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import Storage from '@aws-amplify/storage';
import * as queries from '../../../graphql/queries';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { RiLockPasswordFill } from "react-icons/ri";
import { FaPlus, FaEdit, FaTrashAlt, FaImage } from 'react-icons/fa';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import ProfileInfo from './ProfileInfo';
import AboutMe from './AboutMe';
import ChangePassword from './ChangePassword';
import ProfileVault from './ProfileVault';
import ProfileEdit from './ProfileEdit';
import {
  Switch,
  Route,
  useRouteMatch,
  Link,
  NavLink
} from 'react-router-dom';
import LessonLoading from '../../Lesson/Loading/ComponentLoading';
import * as customMutations from '../../../customGraphql/customMutations';
import ToolTip from '../../General/ToolTip/ToolTip'
import ProfileCropModal from './ProfileCropModal';
import { getImageFromS3 } from '../../../utilities/services';

export interface UserInfo {
  authId: string
  courses?: string
  createdAt: string
  email: string
  externalId?: string
  firstName: string
  grade?: string
  id: string
  image?: string
  institution?: string
  language: string
  lastName: string
  preferredName?: string
  role: string
  status: string
  phone: string
  updatedAt: string
  birthdate?: string
}

const Profile: React.FC = () => {

  const [person, setPerson] = useState<UserInfo>(
    {
      id: '',
      authId: '',
      courses: '',
      createdAt: '',
      email: '',
      externalId: '',
      firstName: '',
      grade: null,
      image: null,
      institution: null,
      language: '',
      lastName: '',
      preferredName: null,
      role: '',
      status: '',
      phone: '',
      updatedAt: '',
      birthdate: null,
    }
  );

  const match = useRouteMatch();
  const { state, theme, dispatch } = useContext(GlobalContext);
  const [status, setStatus] = useState('');
  const [select, setSelect] = useState('Profile');
  const [showCropper, setShowCropper] = useState(false);
  const [upImage, setUpImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('')

  const initials = (firstName: string, lastName: string) => {
    let firstInitial = firstName.charAt(0).toUpperCase()
    let lastInitial = lastName.charAt(0).toUpperCase()
    return firstInitial + lastInitial;
  }

  const stringToHslColor = (str: string) => {
    let hash = 0;
    let i;
    for (i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let h = hash % 360;
    return 'hsl(' + h + ', 70%, 72%)';
  }

  // TODO: 
  // Set type for file instead of any

  const uploadImageToS3 = async (file: any, id: string, type: string) => {
    // Upload file to s3 bucket

    return new Promise((resolve, reject) => {
      Storage.put(`profile_image_${id}`, file, {
        contentType: type,
        ContentEncoding: 'base64',
      }).then(result => {
        console.log('File successfully uploaded to s3', result)
        resolve(true)
      }).catch(err => {
        console.log('Error in uploading file to s3', err)
        reject(err)
      })
    });
  }


  const deletImageFromS3 = (key: string) => {
    // Remove image from bucket

    return new Promise((resolve, reject) => {
      Storage.remove(key).then(result => {
        console.log('File successfully deleted from s3')
        resolve(result)
      }).catch(err => {
        console.log('Error in deleting file from s3', err)
        reject(err)
      })
    });
  }

  const cropSelecetedImage = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setUpImage(fileReader.result)
      }
      fileReader.readAsDataURL(file);
      toggleCropper()
    }
  }

  const toggleCropper = () => {
    setShowCropper(!showCropper)
  }

  const saveCroppedImage = async (image: string) => {
    toggleCropper();
    await uploadImageToS3(image, person.id, 'image/jpeg')
    const imageUrl: any = await getImageFromS3(`profile_image_${person.id}`)
    setImageUrl(imageUrl);
    setPerson({ ...person, image: `profile_image_${person.id}` })
    updateImageParam(`profile_image_${person.id}`);
    toggleCropper();
    dispatch({
      type: 'SET_USER',
      payload: {
        id: state.user.id,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        language: state.user.language,
        onBoardSurvey: state.user.onBoardSurvey ? state.user.onBoardSurvey : false,
        role: state.user.role,
        image: `profile_image_${person.id}`
      }
    })
  }

  async function updateImageParam(imageKey: string) {

    // TODO: 
    // Need to check for update only required input values. 

    const input = {
      id: person.id,
      image: imageKey,
      authId: person.authId,
      grade: person.grade,
      language: person.language,
      lastName: person.lastName,
      preferredName: person.preferredName,
      role: person.role,
      status: person.status,
      phone: person.phone,
      birthdate: person.birthdate,
      email: person.email,
      firstName: person.firstName
    }
    try {
      const update: any = await API.graphql(graphqlOperation(customMutations.updatePerson, { input: input }))
      setPerson({
        ...person,
        ...update.data.updatePerson
      })
    } catch (error) {
      console.error("Error updating image on graphql", error)
    }
  }

  const deletUserProfile = async () => {
    await deletImageFromS3(`profile_image_${person.id}`)
    await removeImageUrlFromDb();
  }


  const removeImageUrlFromDb = async () => {
    const input = {
      id: person.id,
      image: '',
      authId: person.authId,
      grade: person.grade,
      language: person.language,
      lastName: person.lastName,
      preferredName: person.preferredName,
      role: person.role,
      status: person.status,
      phone: person.phone,
      birthdate: person.birthdate,
      email: person.email,
      firstName: person.firstName
    }
    try {
      const update: any = await API.graphql(graphqlOperation(customMutations.updatePerson, { input: input }))
      setPerson({
        ...person,
        ...update.data.updatePerson
      })
    } catch (error) {
      console.error("Error Deleting image on graphql", error)
    }
  }

  async function getUser() {
    try {
      const user: any = await API.graphql(graphqlOperation(queries.getPerson, { email: state.user.email, authId: state.user.authId }))
      setPerson(user.data.getPerson);
      setStatus('done');
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    async function getUrl() {
      const imageUrl: any = await getImageFromS3(person.image);
      setImageUrl(imageUrl);
    }
    getUrl();
  }, [person.image])

  if (status !== 'done') {
    return (
      <LessonLoading />
    )
  }
  {
    return (
      
      <div className="w-full h-9.28/10 md:h-full flex items-center justify-center">
        <div className={`w-9/10 h-full main_container`}>
          <div className={`w-full h-full white_back p-8 ${theme.elem.bg} ${theme.elem.text} ${theme.elem.shadow}`}>

            <div className="h-9/10 flex flex-col md:flex-row">

              <div className="w-auto p-4 flex flex-col text-center items-center">
                {person.image ?
                  (
                    <Fragment>
                      <img
                        className={`profile w-20 h-20 md:w-40 md:h-40 rounded-full border border-gray-400 shadow-elem-light`}
                        src={imageUrl}
                      />
                      <span className="flex justify-center mt-4">
                        <label className="w-8 cursor-pointer">
                          <IconContext.Provider value={{ size: '1.5rem', color: '#5a67d8' }}>
                            <FaEdit />

                            
                          </IconContext.Provider>
                          <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} accept="image/*" multiple={false} />
                        </label>
                        <span className="w-8 cursor-pointer" onClick={deletUserProfile}>
                          <IconContext.Provider value={{ size: '1.5rem', color: '#5a67d8' }}>
                            <FaTrashAlt />

                          </IconContext.Provider>
                        </span>
 
                      </span>

                    </Fragment>
                  ) :
                  (
                    <Fragment>
                      <label className={`w-15 h-15 md:w-40 md:h-40 p-2 md:p-4 flex justify-center items-center rounded-full border border-gray-400 shadow-elem-light`}>
                        <IconContext.Provider value={{ size: '3rem', color: '#a0aec0' }}>
                          <FaImage />
                        </IconContext.Provider>
                        <input type="file" className="hidden" onChange={(e) => cropSelecetedImage(e)} accept="image/*" multiple={false} />
                      </label>

                    </Fragment>
                  )
                }
                <div className={`text-lg md:text-4xl font-bold font-open text-gray-900 mt-4`}>
                  {`${person.preferredName ? person.preferredName : person.firstName} ${person.lastName}`}
                  <p className="text-md md:text-lg">{person.institution}</p>
                </div>
                <span className="flex w-full rounded-md shadow-sm mt-3 relative top-2">
                  <NavLink to={`${match.url}/password`}>
                    <button type="submit" className="inline-flex justify-center pb-2 pt-3 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
                      Change Password
                      <span className="w-8 pl-3 h-4 flex items-center">
                        <IconContext.Provider value={{ size: '2rem', color: '#ffffff' }}>
                          <RiLockPasswordFill />
                        </IconContext.Provider>
                      </span>
                      <ToolTip
                        position='bottom'
                        header=''
                        display='none'
                        content='Change Password'
                        id={'change-password'}
                        cursor
                        width='w-24 px-1 flex justify-center items-center'
                        fontSize='text-xs'
                      />
                    </button>
                  </NavLink>
                </span>
              </div>

              <div className="relative w-full">
                <div className="w-9/10 md:w-6/10 h-8 pl-6 flex justify-between">
                  <div onClick={() => setSelect('Profile')} className={` ${select === 'Profile' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    <NavLink to={`${match.url}`}>
                      My Profile
                    </NavLink>
                  </div>

                  <div onClick={() => setSelect('AboutMe')} className={` ${select === 'AboutMe' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    <NavLink to={`${match.url}/about`}>
                      About Me
                    </NavLink>
                  </div>

                  <div onClick={() => setSelect('Vault')} className={` ${select === 'Vault' ? `${theme.toolbar.bg} text-gray-200 shadow-2 ` : 'bg-gray-200 text-gray-400 shadow-5 hover:shadow-2 hover:text-gray-600 '} w-1/3 uppercase p-2 md:p-0 flex justify-center items-center bg-gray-200 text-gray-400 rounded-lg text-center text-xs md:text-md hover:shadow-2 hover:text-gray-600 cursor-pointer`}>
                    <NavLink to={`${match.url}/vault`}>
                      Vault
                    </NavLink>
                  </div>

                </div>

                <div className="absolute w-auto" style={{ right: '0', top: '0' }}>
                  <NavLink to={`/dashboard`}>
                    <button type="submit" className="inline-flex justify-center py-4 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out items-center">
                      Go Back
                                            <span className="w-8 h-4 flex items-center">
                        <IconContext.Provider value={{ size: '2rem', color: '#ffffff' }}>
                          <IoArrowUndoCircleOutline />
                        </IconContext.Provider>
                      </span>
                      <ToolTip
                        position='bottom'
                        header=''
                        display='none'
                        content='Return to Classroom'
                        id={'goBack'}
                        cursor
                        width='w-24 px-1 flex justify-center items-center'
                        fontSize='text-xs'
                      />
                    </button>
                  </NavLink>
                </div>

                <Switch>
                  <Route
                    exact
                    path={`${match.url}/`}
                    render={() => (
                      <ProfileInfo
                        user={person}
                        status={status}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/about`}
                    render={() => (
                      <AboutMe />
                    )}
                  />
                  <Route
                    path={`${match.url}/edit`}
                    render={() => (
                      <ProfileEdit
                        user={person}
                        status={status}
                        setStatus={setStatus}
                        getUser={getUser}
                      />
                    )}
                  />
                  <Route
                    path={`${match.url}/vault`}
                    render={() => (
                      <ProfileVault />
                    )}
                  />
                  <Route
                    path={`${match.url}/password`}
                    render={() => (
                      <ChangePassword />
                    )}
                  />
                </Switch>
                {showCropper && (
                  <ProfileCropModal upImg={upImage} saveCroppedImage={(img: string) => saveCroppedImage(img)} />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}


export default Profile;