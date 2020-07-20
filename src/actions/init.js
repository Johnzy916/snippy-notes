import { startSetUserData } from './user'
import { startSetTeamData } from './teams'
import { startSetProjectAdmins, startSetAllProjects,
          startSetTeamAdmins, startSetUserRole } from './admin'

export const dispatchData = async (user, store) => {
  try {
    await store.dispatch(startSetUserData(user)) // set user data
  } catch (error) { console.log(`Couldn't set user data: `, error.message)}
  try {
    await store.dispatch(startSetUserRole(user)) // set user role
  } catch (error) { console.log(`Couldn't set user role: `, error.message)}
  try {
    await store.dispatch(startSetTeamData(user)) // set team data
  } catch (error) { console.log(`Couldn't set team data: `, error.message)}
  const state = store.getState()
  // if user is at least a team admin, set state with data
  // necessary for viewing, adding and removing teams, admins, and members
  if (state.admin.role === 'superAdmin') {
    try {
      await store.dispatch(startSetTeamAdmins('superadmin')) // set team admins && members
    } catch (error) { console.log(`Couldn't set team admins: `, error.message)}
    try {
      await store.dispatch(startSetProjectAdmins('superadmin')) // set project admins
    } catch (error) { console.log(`Couldn't set project admins: `, error.message)}
    try {
      await store.dispatch(startSetAllProjects()) // set all projects
    } catch (error) { console.log(`Couldn't set all projects: `, error.message)}
    // project admin
  } else if (state.admin.role === 'projectAdmin') {
    try {
      await store.dispatch(startSetTeamAdmins('admin'))
    } catch (error) { console.log(`Couldn't set team admins: `, error.message)}
    try {
      await store.dispatch(startSetProjectAdmins('admin'))
    } catch (error) { console.log(`Couldn't set project admins: `, error.message)}
    // team admin
  } else if (state.admin.isTeamAdmin && state.admin.isTeamAdmin.length > 0) {
    try {
      await store.dispatch(startSetTeamAdmins('team'))
    } catch (error) { console.log(`Couldn't set team admins: `, error.message)}
  }
}