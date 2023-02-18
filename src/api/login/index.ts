import type { BaseResponse } from '@/utils/request';
import { request, baseApiUrl } from '@/utils/request';

/**
 * @description 登录
 * @param {LoginParams} data
 * @returns
 */
export function login(data: API.LoginParams) {
  return request<BaseResponse<API.LoginResult>>(
    {
      url: 'auth/login',
      method: 'post',
      data,
    },
    {
      isGetDataDirectly: false,
    },
  );
}
/**
 * @description 获取验证码
 */
export function getImageCaptcha(params?: API.CaptchaParams) {
  return request<API.CaptchaResult>({
    url: 'captcha/img',
    method: 'get',
    params,
  });
}
/**
 * 获取验证码图片url
 * @param params
 * @returns
 */
export function getImageCaptchaUrl(params?: API.CaptchaParams) {
  const q = Object.entries(params as any)
    .map(([key, val]) => {
      return `${key}=${encodeURIComponent(String(val))}`;
    })
    .join('&');
  return `${baseApiUrl}auth/captcha?${q}`;
}
