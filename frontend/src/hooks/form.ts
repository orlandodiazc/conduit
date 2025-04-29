import { createFormHook } from '@tanstack/react-form'

import {
  PasswordField,
  Select,
  SubscribeButton,
  TextArea,
  TextField,
} from '../components/Form'
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    PasswordField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
