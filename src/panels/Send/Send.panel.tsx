import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROUTE_NAMES } from "../../router/constants";

import { balanceCheckWatcher, sendCoins } from "../../api";

import { countCharts, errorMapping, formatNumber } from "../../utils";

import {
  currencyDataSelector,
  myTonBalanceSelector,
} from "../../store/reducers/user/user.selectors";

import {
  Avatar,
  Block,
  Button,
  Cell,
  ErrorBlock,
  Group,
  Input,
  Panel,
  Text,
} from "../../components";

import { ReactComponent as QRCopy17OutlineIcon } from "../../icons/QRCopy17Outline.svg";
import { ReactComponent as Date24OutlineIcon } from "../../icons/Date24Outline.svg";
import { useTranslation } from "react-i18next";

import ton from "../../images/ton.jpeg";

import * as amplitude from "@amplitude/analytics-browser";

export const SendPanel: FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<{
    receiverToken: string;
    amount: string;
  }>({
    receiverToken: "",
    amount: "",
  });

  const [isAwaitResponse, setIsAwaitResponse] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const errorBlockTimeoutRef = useRef<NodeJS.Timer | undefined>(undefined);

  const {
    state: locationState,
  }: {
    state: {
      currency: string;
    };
  } = useLocation();

  const currencyData = useSelector((state) =>
    currencyDataSelector(state, locationState.currency)
  );

  const myTonBalance = useSelector(myTonBalanceSelector);

  const comission =
    currencyData?.currency === "ton" || currencyData?.verified ? 0.07 : 0.12;

  const navigate = useNavigate();

  useEffect(() => {
    if (!Telegram.WebApp.MainButton.isVisible) {
      Telegram.WebApp.MainButton.show();
    }
    const buttonText = isAwaitResponse ? `${t("Sending")}...` : t("Send");
    Telegram.WebApp.MainButton.setText(buttonText);

    Telegram.WebApp.MainButton.onClick(withdraw);

    const defaultButtonColor = "#FFFFFF";
    const buttonColor =
      Telegram.WebApp.themeParams.button_color || defaultButtonColor;
    Telegram.WebApp.MainButton.color = buttonColor;

    return () => {
      Telegram.WebApp.MainButton.offClick(withdraw);
    };
  });
  useEffect(() => {
    Telegram.WebApp.MainButton
      .setText(isAwaitResponse ? `${t("Sending")}...` : t("Send"))
      .onClick(withdraw);
  
    Telegram.WebApp.MainButton.color = Telegram.WebApp.themeParams.button_color || "defaultColor";  // Replace "defaultColor" with an appropriate fallback color
    
    return () => {
      Telegram.WebApp.MainButton.offClick(withdraw);
    };
  }, [isAwaitResponse]); 

  useEffect(() => {
    amplitude.track("SendPage.Launched");
    const handlerQRText = ({ data }: { data: string }) => {
      try {
        window.navigator.vibrate(70);
      } catch (e) {
        Telegram.WebApp.HapticFeedback.impactOccurred("light");
      }

      setFormData((prev) => ({
        ...prev,
        receiverToken: data.split("ton://transfer/")[1],
      }));

      Telegram.WebApp.closeScanQrPopup();
    };

    Telegram.WebApp.onEvent("qrTextReceived", handlerQRText);
    Telegram.WebApp.enableClosingConfirmation();

    return () => {
      Telegram.WebApp.offEvent("qrTextReceived", handlerQRText);
      Telegram.WebApp.disableClosingConfirmation();
    };
  }, []);

  useEffect(() => {
    if (error) {
      if (errorBlockTimeoutRef.current) {
        clearTimeout(errorBlockTimeoutRef.current);
      }

      errorBlockTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorBlockTimeoutRef.current);
      errorBlockTimeoutRef.current = undefined;
    };
  }, [error]);

  const openQRScanner = () => {
    const scanTokenText = t("Scan token");
    amplitude.track("SendPage.QRButton.Pushed");
    Telegram.WebApp.showScanQrPopup({
      text: scanTokenText,
    });
  };

  const selectMaxAmount = () => {
    amplitude.track("SendPage.MaxButton.Pushed");
    let newAmount = "";

    if (currencyData?.currency === "ton") {
      if (currencyData?.amount <= 0.07) {
        newAmount = "0";
      } else {
        newAmount =
          String(+(Number(currencyData?.amount) - 0.07).toFixed(3)) || "";
      }
    } else {
      newAmount = String(+Number(currencyData?.amount).toFixed(3)) || "";
    }

    try {
      window.navigator.vibrate(70);
    } catch (e) {
      Telegram.WebApp.HapticFeedback.impactOccurred("light");
    }

    setFormData({
      ...formData,
      amount: newAmount,
    });
  };

  const withdraw = async () => {
    if (myTonBalance.amount < comission) {
      Telegram.WebApp.showAlert(t("You don't have enough TON"));

      return;
    }

    Telegram.WebApp.MainButton.showProgress(true);
    Telegram.WebApp.MainButton.disable();
    setIsAwaitResponse(true);

    const payload = {
      ton_address: formData.receiverToken,
      amount: Number(formData.amount),
      currency: locationState.currency,
    };

    const response: any = await sendCoins({
      payload,
    }).finally(() => {
      Telegram.WebApp.MainButton.hideProgress();
      Telegram.WebApp.MainButton.enable();
      setIsAwaitResponse(false);
    });

    if (
      response?.data &&
      !response?.response?.data.error &&
      !response?.data.error
    ) {
      await balanceCheckWatcher();

      amplitude.track("SendPage.SendButton.Pushed");

      navigate(ROUTE_NAMES.SEND_SUCCESS, {
        state: payload,
      });
    } else if (response?.response?.data?.error || response?.data?.error) {
      try {
        window.navigator.vibrate(200);
      } catch (e) {
        Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
      }

      setError(response?.response?.data?.error || response?.data?.error);
    }
  };

  return (
    <Panel>
      <Group space={24}>
        <Block padding={24}>
          <Cell
            after={
              <Text
                weight={"600"}
                size={14}
                lineHeight={"17px"}
                color={"var(--accent)"}
              >
                {formatNumber(currencyData?.amount)}{" "}
                {currencyData?.currency.toUpperCase()}
              </Text>
            }
            before={
              <Avatar
                size={42}
                fallbackName={currencyData?.currency.slice(0, 1)}
                src={
                  currencyData.currency === "ton" ? ton : currencyData?.image
                }
              />
            }
          >
            {currencyData?.name}
          </Cell>
        </Block>
        <Group space={12}>
          <Input
            placeholder={t("Enter receiver address") as string}
            after={
              <QRCopy17OutlineIcon
                style={{ cursor: "pointer" }}
                color="var(--accent)"
                onClick={openQRScanner}
              />
            }
            value={formData.receiverToken}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e?.currentTarget.value || "";

              setFormData({
                ...formData,
                receiverToken: newValue,
              });
            }}
            disabled={isAwaitResponse}
          />
          <Input
            placeholder={t("Amount") as string}
            after={
              <div onClick={selectMaxAmount}>
                <Text
                  weight={"600"}
                  size={14}
                  lineHeight={"17px"}
                  color={"var(--accent)"}
                  style={{ cursor: "pointer" }}
                >
                  {t("Max")}
                </Text>
              </div>
            }
            value={formData.amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              let newValue = (e?.currentTarget.value || "").replace(
                /[^\d.]+/g,
                ""
              );

              if (countCharts(newValue || "", ".") > 1) {
                return;
              }

              if (countCharts(newValue || "", ".") === 1) {
                const chartsAfterDot = newValue.split(".")[1];

                if (chartsAfterDot.length > 3) {
                  return;
                }
              }

              if (
                (currencyData?.currency === "TON" &&
                  Number(newValue) > currencyData?.amount - comission) ||
                Number(newValue) > currencyData?.amount
              ) {
                selectMaxAmount();

                return;
              }

              setFormData({
                ...formData,
                amount: newValue,
              });
            }}
            disabled={isAwaitResponse}
          />
        </Group>
        <ErrorBlock
          text={`${t("Comission")} — ${comission} TON`}
          iconColor="var(--color_primary_color)"
          color="var(--background_block)"
          backgroundColor="transparent"
        />
        {error ? <ErrorBlock text={errorMapping(error)} /> : null}
      </Group>
    </Panel>
  );
};
