import {
    INITIAL_STATE,
    MAILING_LIST,
    PERIODS,
  } from 'pages/RYU/RYUPages/Newsletters/consts';
import { parseDateNew2 } from 'utils/functions/dateTime';

const getArrayIds = (id?: number) => {
    return id ? [id.toString()] : [];
};

const getInitialObjectArray = (initObject?: ClientDtoRs | SsksProductDtoRs) => {
    return initObject
      ? [
          {
            id: initObject.id as number,
            name: initObject.name as string,
          },
        ]
      : [];
  };

const setType = (calledFrom: ECalledFrom): string[] => {
    switch (calledFrom) {
      case ECalledFrom.RIU_ITEM:
        return MAILING_LIST.map(item => item.id!.toString());
      case ECalledFrom.RIU_NONFINANCIAL_CONDITIONS:
        return [SubscriptionDtoTypeEnum.CONDITION_DATE.toString()];
      case ECalledFrom.RIU_INNER_ASSIGNMENTS:
        return [SubscriptionDtoTypeEnum.ASSIGNMENT_DATE.toString()];
      case ECalledFrom.RIU_DOCUMENT_TERM:
        return [SubscriptionDtoTypeEnum.DOCUMENT_DATE.toString()];
      case ECalledFrom.RIU_SERVICE_TERM:
        return [SubscriptionDtoTypeEnum.DOCUMENT_SERVICE_TERM.toString()];
      default:
        return [];
    }
  };

export const setDataFromItem = (
    item: SubscriptionDto | undefined,
    calledFrom: ECalledFrom,
    individualCondition?: SsksIndividualConditionCustom,
    chosenAssignment?: string | null,
    chosenWording?: string | null,
    currentStaff?: StaffDto,
  ): FormModel => {
    const getInitStaff = () =>
      currentStaff?.id ? [String(currentStaff.id)] : [];
  
    if (individualCondition) {
      const assignments =
        individualCondition?.assignments?.map(
          assignment => assignment.assignmentId?.toString() ?? '0',
        ) ?? [];
      const wordings =
        individualCondition?.wordings?.map(wording => wording.id.toString()) ??
        [];
      const state: FormModel = {
        ...INITIAL_STATE,
        selections: {
          ...INITIAL_STATE.selections,
          companyGroups: getArrayIds(individualCondition.companyGroup?.id),
          clients: getArrayIds(individualCondition.client?.id),
          filials: getArrayIds(individualCondition.filial?.id),
          products: getArrayIds(individualCondition.product?.id),
          individualConditions: individualCondition
            ? [individualCondition.id as number]
            : [],
          assignments: chosenAssignment ? [chosenAssignment] : assignments,
          icWordings: chosenWording ? [chosenWording] : wordings,
        },
        types: setType(calledFrom),
        periods: item ? PERIODS.map(({ value }) => value) : [],
        startDate: null,
        endDate: null,
        subscriberGroups: [],
        staffs: getInitStaff(),
        emails: [],
        initialObject: {
          active: true,
          selections: {
            companyGroups: getInitialObjectArray(
              individualCondition.companyGroup,
            ),
            clients: getInitialObjectArray(individualCondition.client),
            filials: getInitialObjectArray(individualCondition.filial),
            products: getInitialObjectArray(individualCondition.product),
          },
        } as any,
      };
  
      return state;
    }
  
    // TODO для формулировок добавить проверку из Нефинансовых условий
    // TODO для поручений добавить проверку из Нефинансовых условий
    const assignments =
      item?.selections?.assignments?.map(
        assignment => assignment?.toString() ?? '0',
      ) ?? [];
    const wordings =
      item?.selections?.wordings?.map(wordingId => wordingId.toString()) ?? [];
    const state: FormModel = {
      ...INITIAL_STATE,
      selections: {
        ...INITIAL_STATE.selections,
        companyGroups: item?.selections?.companyGroups
          ? item?.selections?.companyGroups.map(item => item.id!.toString())
          : [],
        clients: item?.selections?.clients
          ? item?.selections?.clients.map(item => item.id!.toString())
          : [],
        filials: item?.selections?.filials
          ? item?.selections?.filials.map(item => item.id!.toString())
          : [],
        products: item?.selections?.products
          ? item?.selections?.products.map(item => item.id!.toString())
          : [],
        assignments: chosenAssignment ? [chosenAssignment] : assignments,
        icWordings: chosenWording ? [chosenWording] : wordings,
        wordings: item?.selections?.wordings
          ? item?.selections?.wordings.map(item => item.toString())
          : [],
        individualConditions: item?.selections?.individualConditions ?? [],
      },
      types: item?.types ? item?.types.map(item => item.id!.toString()) : [],
      periods: item?.periods
        ? item.periods?.map(item => item.id!.toString())
        : [],
      rules: item?.rules ? item.rules?.map(item => item.id!.toString()) : [],
      startDate: item?.startDate
        ? parseDateNew2((item.startDate as unknown) as string)
        : null,
      endDate: item?.endDate
        ? parseDateNew2((item.endDate as unknown) as string)
        : null,
      subscriberGroups: item?.subscriberGroups
        ? item?.subscriberGroups.map(item => item.id!.toString())
        : [],
      staffs: item?.staffs
        ? item?.staffs.map(item => item.id!.toString())
        : getInitStaff(),
      emails: item?.emails
        ? item?.emails.map(item => ({ id: item, value: item, isValid: true }))
        : [],
      params: item?.params ? item?.params : {},
      comment: item?.comment ? item.comment : '',
      initialObject: item,
    };
  
    return state;
  };


  