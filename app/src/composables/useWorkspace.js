import { computed } from "vue"
import { Connection, PublicKey } from "@solana/web3.js"
import { useAnchorWallet } from "solana-wallets-vue"
import { AnchorProvider, Program } from "@project-serum/anchor" //changed provider to anchorprovider
import idl from '@/idl/blogger.json'

const preflightCommitment = 'processed'
const commitment = 'processed'
const programID = new PublicKey(idl.metadata.address);
let workspace = null

export const useWorkspace = () => workspace

export const initWorkspace = () => {
    const wallet = useAnchorWallet()
    const connection = new Connection('https://api.devnet.solana.com', commitment)
    const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment, commitment }))
    // const connection = new Connection('http://127.0.0.1:8081')
    // const provider = computed(() => new AnchorProvider(connection, wallet.value)) // changed provider to anchorprovider
    const program = computed(() => new Program(idl, programID, provider.value))

    workspace = {
        wallet,
        connection,
        provider,
        program,
    }
}