import { suggestive } from 'yup-locale-ja/cjs/suggestive';

import yup from './custom/yup.custom';

yup.setLocale(suggestive);

export default yup;
