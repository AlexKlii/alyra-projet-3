"use client";

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { readContractByFunctionName } from "@/utils"
import { useRouter } from 'next/navigation';

import VoterManager from "@/components/admin/VoterManager"
import IsConnected from "@/components/IsConnected";
import Event from "@/components/Event";

const Admin = () => {
  const { address, isConnected } = useAccount()
  const { push } = useRouter()

  const [owner, setOwner] = useState('')
  const [winningProposalID, setWinningProposalID] = useState<number|null>(null)
  const [workflowStatus, setWorkflowStatus] = useState(0)
  const [isOwner, setIsOwner] = useState(false)

  const WorkflowStatus: string[] = [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied"
  ]

  const getOwner = async () => {
    readContractByFunctionName<`0x${string}`>('owner').then(
      hash => {
        setOwner(hash)
        setIsOwner(hash === address)
        if (hash !== address) push('/')
    }).catch(() => push('/'))
  }

  const getWinningProposalID = async () => {
    readContractByFunctionName<number>('winningProposalID').then(
        id => setWinningProposalID(id)
    ).catch(
        err => console.log(err.message)
    )
  }

  const getWorkflowStatus = async () => {
    readContractByFunctionName<number>('workflowStatus').then(
        id => setWorkflowStatus(id)
    ).catch(
        err => console.log(err.message)
    )
  }

  useEffect(() => {
    if (isConnected) {
      getOwner()
      getWinningProposalID()
      getWorkflowStatus()
    }
  }, [address, isConnected])

  return (
    <div className="flex flex-col space-y-2 mx-auto max-w-screen-lg">
      <IsConnected>
        {isOwner ? (
          <>
            <div className="mx-auto w-3/4 rounded h-auto bg-gradient-to-r from-indigo-900 to-indigo-600 text-indigo-100 shadow-lg">
              <div className="p-4">
                <p>owner : {owner}</p>
                <p>address: {address}</p>
              </div>
            </div>

            <div className="mx-auto w-3/4 rounded h-auto bg-gradient-to-r from-indigo-900 to-indigo-600 text-indigo-100 shadow-lg">
              <div className="p-4">
                winningProposalID : {winningProposalID}
              </div>
            </div>

            <div className="mx-auto w-3/4 rounded h-auto bg-gradient-to-r from-indigo-900 to-indigo-600 text-indigo-100 shadow-lg">
              <div className="p-4">
                WorkflowStatus : {WorkflowStatus[workflowStatus]}
              </div>
            </div>

            {WorkflowStatus[workflowStatus] === "RegisteringVoters" ? (
              <VoterManager />
            ) : (<></>)}

            <Event name='VoterRegistered'></Event>
          </>

        ) : (
          <div className="mx-auto w-3/4 rounded h-[90px] bg-gradient-to-r from-indigo-950 to-rose-600 text-zinc-200 shadow-lg">
            <div className="flex justify-between pt-2">
              <div className="px-4 font-light text-sm">
                You are not the owner !
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <div className="px-4 font-light text-sm">
                The owner is {owner}
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <div className="px-4 font-light text-sm">
                You are {address}
              </div>
            </div>
          </div>
        )}
      </IsConnected>
    </div>
  )
}

export default Admin