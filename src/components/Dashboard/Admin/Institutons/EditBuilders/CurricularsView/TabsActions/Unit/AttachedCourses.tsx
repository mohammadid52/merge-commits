import Placeholder from "@components/Atoms/Placeholder";
import Tooltip from "@components/Atoms/Tooltip";
import useAuth from "@customHooks/useAuth";
import { logError } from "@graphql/functions";
import { getImageFromS3Static } from "@utilities/services";
import { orderBy } from "lodash";
import React from "react";
import { useHistory } from "react-router";

const AttachedCourses = ({
  curricular,
  unitId,
}: {
  curricular: any;
  unitId: string;
}) => {
  const { email, authId } = useAuth();
  const getAttachedCourses = (): any[] => {
    try {
      if (curricular) {
        const filtered = curricular?.items?.filter((item: any) => {
          if (item?.universalSyllabus) {
            return item?.universalSyllabus?.items?.find(
              (item: any) => item?.unit?.id === unitId
            );
          }
        });

        const sorted = orderBy(filtered, ["name"], ["asc"]);

        return sorted;
      }
      return [];
    } catch (error) {
      logError(error, { authId, email }, "AttachedCourses @getAttachedCourses");
      return [];
    }
  };

  const attachedCourses: any[] = getAttachedCourses();

  const history = useHistory();
  const { isSuperAdmin, instId } = useAuth();
  const redirectToCourse = (id: string) => {
    history.push(
      isSuperAdmin
        ? `/dashboard/manage-institutions/course-builder/${id}`
        : `/dashboard/manage-institutions/institution/${instId}/course-builder/${id}`
    );
  };

  return (
    <ul className="list-disc grid grid-cols-2 ">
      {attachedCourses.length > 0 ? (
        attachedCourses?.map((curricula: any) => {
          if (curricula) {
            return (
              <Tooltip
                key={curricula.id}
                placement="left"
                text={`Go to ${curricula.name}`}
              >
                <li key={curricula.id} className="flex items-center gap-y-2">
                  <div className="flex-shrink-0 h-8 w-8 flex items-center">
                    {curricula.image ? (
                      <img
                        src={getImageFromS3Static(curricula.image)}
                        className="h-5 w-5 rounded-full"
                      />
                    ) : (
                      <Placeholder name={curricula.name} size="h-5 w-5" />
                    )}
                  </div>
                  <h4
                    onClick={() => redirectToCourse(curricula.id)}
                    className="text-gray-700 cursor-pointer hover:underline hover:theme-text:400 text-sm"
                  >
                    {curricula.name}
                  </h4>
                </li>
              </Tooltip>
            );
          }
          return <div className="w-auto hidden" />;
        })
      ) : (
        <p className="text-gray-600 text-xs">no attached course found</p>
      )}
    </ul>
  );
};

export default AttachedCourses;
